from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.crypto import constant_time_compare
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

class CustomTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        """
        Generate a hash value that is used as the token.
        """
        return (
            str(urlsafe_base64_encode(str(user.pk).encode('utf-32'))) + "-" + str(timestamp) +"-"+
            str(user.is_active)
        )

    def make_token(self, user):
        """
        Override make_token to generate a token without relying on last_login.
        """
        return self._make_hash_value(user, self._num_seconds(self._now()))

    def check_token(self, user, token):
        """
        Override check_token to validate the token without relying on last_login.
        """
        if not (user and token):
            return False
        try:
            # Split the token into its components
            user_pk, timestamp, is_active = token.split("-")
            
            # Convert the user_pk to an integer
            user_pk = int(urlsafe_base64_decode(user_pk).decode('utf-32'))
            
            # Check if the user_pk matches the user's primary key
            if user_pk != user.pk:
                return False
            
            # Ensure that the token is valid for the user
            if not constant_time_compare(self._make_hash_value(user, timestamp), token):
                return False
        except (ValueError, TypeError):
            return False
        return True

custom_token_generator = CustomTokenGenerator()
